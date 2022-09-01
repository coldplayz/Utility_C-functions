#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
#include <string.h>
#include <stdio.h>

/**
 * main - copies content from one file to another
 * @argc: the number of arguments passed
 * @argv: an array of strings
 *
 * Return: always 0
 */
int main(int argc, char *argv[])
{
	int fd1, fd2;
	char ar1[10240];

	if ((strcmp(argv[0], "/home/vagrant/utility_functions/alias_files/cfrom") == 0) && (argc == 1))
	{
		printf("Copies the content of /vagrant/Downloads/cp.txt to specified file\n"
				"Usage: cfrom [file_path]\n");
		return (0);
	}

	fd2 = open("/vagrant/Downloads/cp.txt", O_CREAT | O_RDWR, 0600);
	if (fd2 < 0)
	{
		printf("Error reading /vagrant/Downloads/cp.txt\n");
	}

	fd1 = open(argv[1], O_CREAT | O_RDONLY, 0600);
	if (fd1 < 0)
	{
		printf("Error: argument 2: check that the file path is valid, and you have permissions to read/write\n");
	}

	read(fd1, ar1, 10240);
	write(fd2, ar1, strlen(ar1));

	close(fd1);
	close(fd2);

	return (0);
}
